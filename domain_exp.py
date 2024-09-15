import os
import time
import yaml
import argparse
import logging
from concurrent.futures import ThreadPoolExecutor
from utils.utils import generate_response_with_cache
import re
from tqdm import tqdm
from utils.utils import normal

logger = logging.getLogger(__name__)

class CustomLoader(yaml.SafeLoader):
    def construct_mapping(self, node, deep=False):
        mapping = super(CustomLoader, self).construct_mapping(node, deep=deep)
        return {k: v for k, v in mapping.items() if v is not None}

def load_yaml_data(file_path):
    logger.info(f"YAMLファイルを読み込み中: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as file:
        try:
            data = yaml.safe_load(file)
            logger.info("YAMLファイルの読み込みに成功しました")
            return data
        except yaml.YAMLError as e:
            logger.error(f"YAMLファイルの解析中にエラーが発生しました: {e}")
            return None


def get_file_description(file_path, file_ext_data):
    rel_path = os.path.relpath(file_path, start=os.path.dirname(os.path.dirname(os.path.dirname(file_path))))
    file_name = os.path.basename(file_path)
    constraints = []
    specific_description = ""

    # パスの各部分を逆順に確認
    path_parts = rel_path.split(os.path.sep)
    for i in range(len(path_parts), 0, -1):
        current_path = os.path.sep.join(path_parts[i-1:])
        for pattern, rules in file_ext_data.get('rules', {}).items():
            if re.search(pattern, current_path):
                for rule in rules:
                    if isinstance(rule, list):
                        constraints.extend(rule)
                    elif isinstance(rule, dict):
                        for sub_pattern, description in rule.items():
                            if re.search(sub_pattern, current_path) or re.search(sub_pattern, file_name):
                                specific_description = description
                                return constraints, specific_description

    return constraints, specific_description


def generate_file(file_path, description, file_ext_data, max_tokens):
    logger.info(f"ファイル生成開始: {file_path}")
    constraints, specific_description = get_file_description(file_path, file_ext_data)
    
    constraints_str = "\n".join(f"- {constraint}" for constraint in constraints) if constraints else "特定の制約はありません。"
    specific_description = specific_description if specific_description else "特定の説明はありません。"
    
    prompt = f"""
ファイル名: {file_path}
説明: {description}

ファイルの制約:
{constraints_str}

特定の説明:
{specific_description}

このファイルの適切な内容を生成してください。以下の点に注意してください：
1. ファイル名と説明に基づいて、適切な内容を生成すること。
2. 上記の制約と説明に従って、正しい形式とベストプラクティスを守ること。
3. 必要に応じて、適切なコメントを含めること。
4. 生成されたコードは、実際に動作する可能性が高いものにすること。
5. セキュリティとパフォーマンスを考慮すること。

生成を開始してください。
    """
    
    print(f"デバッグ: 生成されたプロンプト = \n{prompt}")
    
    try:
        content = generate_response_with_cache(
            prompt,
            max_tokens=max_tokens,
            temperature=0.7,
            system_content="あなたは優秀なプログラマーです。与えられたファイル名、説明、ファイル拡張子の説明に基づいて、適切なコードや内容を生成してください。"
        )
        content = normal(content)
        
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(content)
        return prompt
    except Exception as e:
        logger.error(f"ファイル生成中にエラーが発生しました: {file_path}, エラー: {e}")
        return None

def process_yaml_structure(structure, file_ext_data, base_dir=""):
    tasks = []
    logger.info(f"YAMLデータの処理開始: {base_dir}")
    if isinstance(structure, list):
        for item in structure:
            tasks.extend(process_yaml_structure(item, file_ext_data, base_dir))
    elif isinstance(structure, dict):
        for key, value in structure.items():
            if isinstance(value, (list, dict)):
                dir_path = os.path.join(base_dir, key)
                tasks.extend(process_yaml_structure(value, file_ext_data, dir_path))
            elif isinstance(value, str):
                file_path = os.path.join(base_dir, key)
                tasks.append((file_path, value))
                logger.debug(f"タスクに追加: {file_path}")
    return tasks

def generate_files_concurrently(tasks, max_tokens, file_ext_data, max_workers=10):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(generate_file, task[0], task[1], file_ext_data, max_tokens) for task in tasks]
        for future, task in tqdm(zip(futures, tasks), total=len(tasks), desc="ファイル生成進捗"):
            prompt = future.result()
            if prompt:
                logger.info(f"\nファイル: {task[0]}\nプロンプト:\n{prompt}")
    logger.info("並列ファイル生成完了")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="YAMLファイルからディレクトリ構造を生成するスクリプト")
    parser.add_argument("-f", "--file", required=True, help="使用するYAMLファイルのパス")
    parser.add_argument("-e", "--ext", required=True, help="ファイル拡張子の説明が記載されたYAMLファイルのパス")
    parser.add_argument("-t", "--tokens", type=int, default=4096, help="生成する最大トークン数")
    parser.add_argument("-s", "--system", required=True, help="生成するシステム名")
    args = parser.parse_args()

    start_time = time.time()

    output_dir = os.path.expanduser(f"~/babel_generated/{args.system}/")
    logger.info(f"出力ディレクトリ: {output_dir}")

    yaml_data = load_yaml_data(args.file)
    file_ext_data = load_yaml_data(args.ext)

    if yaml_data is not None and file_ext_data is not None:
        logger.debug(f"yaml_data = {yaml_data}")
        logger.debug(f"file_ext_data = {file_ext_data}")
        tasks = process_yaml_structure(yaml_data, file_ext_data, output_dir)
        logger.info(f"生成タスク数: {len(tasks)}")

        generate_files_concurrently(tasks, args.tokens, file_ext_data)

        logger.info(f"処理完了。処理時間: {time.time() - start_time:.2f}秒")
        logger.info(f"生成されたファイルは {output_dir} に格納されています。")
    else:
        logger.error("YAMLファイルの読み込みに失敗したため、処理を中止します。")

    logger.info("\nYAMLファイルの内容:")
    with open(args.file, 'r', encoding='utf-8') as file:
        logger.info(file.read())
    logger.info("\nファイル拡張子の説明YAMLファイルの内容:")
    with open(args.ext, 'r', encoding='utf-8') as file:
        logger.info(file.read())
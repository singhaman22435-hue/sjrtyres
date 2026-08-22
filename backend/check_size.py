import os

folder_path = r"d:\SRJtyres\frontend\public\tyre images"

def get_size(start_path):
    total_size = 0
    file_count = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            if not os.path.islink(fp):
                total_size += os.path.getsize(fp)
                file_count += 1
    return total_size, file_count

size_bytes, count = get_size(folder_path)
print(f"Total Images: {count}")
print(f"Total Size: {size_bytes / (1024*1024):.2f} MB")

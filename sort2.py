def counting_sort_for_radix(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10

    
    for i in range(n):
        index = (arr[i] // exp)
        count[index % 10] += 1

   
    for i in range(1, 10):
        count[i] += count[i - 1]

    
    i = n - 1
    while i >= 0:
        index = (arr[i] // exp)
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1

  
    for i in range(n):
        arr[i] = output[i]


def radix_sort(arr):
    if not arr:
        return arr
    
    max_val = max(arr)


    exp = 1
    while max_val // exp > 0:
        counting_sort_for_radix(arr, exp)
        exp *= 10

    return arr



if __name__ == "__main__":
    test_arr = [170, 45, 75, 90, 802, 24, 2, 66]
    print("Mảng ban đầu:", test_arr)
    
    sorted_arr = radix_sort(test_arr)
    print("Mảng sau khi sắp xếp:", sorted_arr)

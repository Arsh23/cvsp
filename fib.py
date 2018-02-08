import time
import asyncio
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import ProcessPoolExecutor


def fib_sync(x):
    if x == 0 or x == 1:
        return 1
    return fib_sync(x-1) + fib_sync(x-2)


def run_sync(n):
    start = time.time()
    for x in range(50):
        fib_sync(n)
    print(f'Time for synchronous fib(): {time.time() - start} seconds')


async def fib_async(x):
    if x == 0 or x == 1:
        return 1
    return await fib_async(x-1) + await fib_async(x-2)


async def main_async(n):
    for x in range(50):
        await fib_async(n)


def run_async(n):
    start = time.time()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main_async(n))
    loop.close()
    print(f'Time for asynchronous fib(): {time.time() - start} seconds')


def run_parallel_threads(n):
    start = time.time()
    with ThreadPoolExecutor() as executor:
        executor.map(fib_sync, [n for x in range(50)])
    print(f'Time for parallel(threads) fib(): {time.time() - start} seconds')


def run_parallel_processes(n):
    start = time.time()
    with ProcessPoolExecutor() as executor:
        executor.map(fib_sync, [n for x in range(50)])
    print(f'Time for parallel(processes) fib(): {time.time() - start} seconds')


run_sync(30)
run_async(30)
run_parallel_threads(30)
run_parallel_processes(30)

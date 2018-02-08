import time
import asyncio
import aiohttp
import requests
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import ProcessPoolExecutor

session = requests.session()
Q = asyncio.Queue()


def get_sync(url):
    r = session.get(url)


def run_sync():
    start = time.time()
    for x in range(50):
        get_sync('https://httpbin.org/')
    print(f'Time for synchronous fib(): {time.time() - start} seconds')


async def get_async(session):
    while True:
        url = await Q.get()
        async with session.get(url) as response:
            await response.text()
        Q.task_done()


async def main_async(loop):
    for x in range(50):
        Q.put_nowait('https://httpbin.org/')
    async with aiohttp.ClientSession() as session:
        tasks = [loop.create_task(get_async(session)) for x in range(50)]
        await Q.join()
        [task.cancel() for task in tasks]


def run_async():
    start = time.time()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(asyncio.gather(main_async(loop)))
    loop.close()
    print(f'Time for asynchronous fib(): {time.time() - start} seconds')


def run_parallel_threads():
    start = time.time()
    with ThreadPoolExecutor() as executor:
        executor.map(get_sync, ['https://httpbin.org/' for x in range(50)])
    print(f'Time for parallel(threads) fib(): {time.time() - start} seconds')


def run_parallel_processes():
    start = time.time()
    with ProcessPoolExecutor() as executor:
        executor.map(get_sync, ['https://httpbin.org/' for x in range(50)])
    print(f'Time for parallel(processes) fib(): {time.time() - start} seconds')


run_sync()
run_async()
run_parallel_threads()
run_parallel_processes()

import asyncio

async def printhi():
    print('hi')

async def main():
    await asyncio.gather(printhi(), printhi(), printhi())





if __name__ == '__main__':
    asyncio.run(main())







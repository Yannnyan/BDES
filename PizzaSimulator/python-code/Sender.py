from Generator import *
from time import sleep
import requests
import logging
import threading
logfile_name = 'kernel.log'
logging.basicConfig(filename=logfile_name, encoding='utf-8', level=logging.DEBUG)
with open(logfile_name, 'w'):
    pass

# def tester():
#     for i in range(10):
#         orders = generate_orders(50, i)
#         for order in orders:
#             print(str(order))
#         sleep(10)


class Sender:
    def __init__(self) -> None:
        pass

    def Send_Test(self, order):
        self.Send(order)

    def Send(self, order: PizzaOrder):
        self.Send_message(order.__dict__)

    def Send_message(self, msg):
        r = requests.post(url='http://localhost:3001', data=msg)
        p = r.text
        logging.info("thread id: " + str(threading.currentThread().ident) + " thread role: " + threading.current_thread().getName())
        logging.info(p)
        logging.info("\n\r\n")





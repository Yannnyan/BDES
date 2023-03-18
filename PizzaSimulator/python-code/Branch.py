from Order import *
from Generator import *
from Sender import Sender
import asyncio
from time import sleep
from enum import Enum
import queue
import threading


class Available_Branch_Locations(Enum):
    north = 1
    south = 2
    center = 3
    dan = 4
    haifa = 5

class Branch:
    def __init__(self, average_orders, branch_id, branch_location, branch_name, worker_slack) -> None:
        self.average_orders = average_orders
        self.branch_id = branch_id
        self.branch_location = branch_location
        self.branch_name = branch_name
        self.next_order_id = 0
        self.orders_queue = queue.Queue()
        self.sender = Sender()
        self.finished_recieving = False
        self.worker_slack = worker_slack

    def create_unique_order_id(self):
        """unique order ids are created with the prefix for the branch id, followed by the next order id saved by the branch"""
        self.next_order_id += 1
        return (str(self.branch_id) + ',' + str(self.next_order_id))
    
    def recieve_orders(self):
        # work_slack = 60 / 10 # 60 seconds devided by how much orders per minute are finished
        generator = Generator(self.worker_slack)
        for i in range(10): # num epochs = 10
            # n_orders = AV +/- ε  Such that: ε <= (AV / 10)
            n_orders = int(self.average_orders + math.pow(-1, random.randint(0, 1)) * random.randint(0, int(self.average_orders / 10)))
            for j in range(n_orders):
                # generate the order
                order = generator.generate_order()
                # include branch details and change order status to in progress
                order.change_order_status()
                order.include_branch_details(self.branch_id, self.create_unique_order_id(), self.branch_location, self.branch_name)
                # send the order to the server
                self.sender.Send(order)
                # put the order to the queue of the pizza maker
                self.orders_queue.put(order)
                generator.work_slack() # make the generator sleep a bit

        self.finished_recieving = True

    def handle_orders(self):
        # assuming the work rate is linear
        # worker_slack = 60 / 10 # 60 seconds devided by how much orders per minute are finished
        generator = Generator(self.worker_slack)
        while True:
            if(self.finished_recieving and not self.orders_queue.not_empty):
                return
            finished_order: PizzaOrder = self.orders_queue.get(timeout=10)
            generator.work_slack() # make the order (sleep for the worker_slack)
            finished_order.change_order_status()
            # finished a pizza, then deliver it to the sender
            self.sender.Send(finished_order)
            

    def work(self):
        producer = threading.Thread(target=self.recieve_orders,name="producer thread")
        consumer = threading.Thread(target=self.handle_orders, name="consumer thread")
        consumer.start()
        producer.start()
        threading.Thread.join(consumer)
        threading.Thread.join(producer)


    



    
    









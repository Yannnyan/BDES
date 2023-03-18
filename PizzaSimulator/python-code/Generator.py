from Order import *
import random
import math
import time

class Generator:
    def __init__(self, slack_worker_seconds: float) -> None:
        self.worker_slack = slack_worker_seconds

    def generate_orders(self, n_orders):
        """
        Generates n orders
        """
        orders = []
        for i_order in range(n_orders):
            # get new order
            orders.append(self.generate_order())

        return orders
    
    def generate_order(self):
        order = PizzaOrder()
        m_toppings = random.randint(0, len(Available_Toppings))
        #set the order's toppings
        for i_topping in range(m_toppings):
            rand_topping = random.randint(1, len(Available_Toppings))
            if not Available_Toppings(rand_topping).name in order.toppings:
                order.toppings.append(Available_Toppings(rand_topping).name)
        return order
    
    def work_slack(self):
        time.sleep(self.worker_slack)



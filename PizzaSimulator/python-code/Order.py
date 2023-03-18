from functools import reduce
from enum import Enum
from datetime import datetime
import logging

class Available_Toppings(Enum):
    Mushroom = 1
    Onion = 2
    Olive = 3
    Eggplant = 4
    Tomato = 5
    Corn = 6


class Available_Order_Status(Enum):
    In_Progress = 1
    Done = 2


class PizzaOrder:
    def __init__(self) -> None:
        self.start_date = None
        self.end_date = None
        self.toppings = []
        self.branch_id = None
        self.unique_order_id = None
        self.branch_location = None
        self.branch_name = None
        self.status = None

    def __str__(self):
        conc = lambda str1, str2 : str1 + " " + str2
        return reduce(conc , self.toppings , 
                      " OrderId: " + str(self.unique_order_id) + " BranchName: " + self.branch_name + " BranchId: " + str(self.branch_id)
                        + " OrderStatus: " + self.status.name +  " order date: "  + str(self.start_date) + 
                        " BranchLocation: " + self.branch_location + " Toppings: ")

    def include_branch_details(self, branch_id, unique_order_id, branch_location, branch_name):
        self.branch_id = branch_id
        self.unique_order_id = unique_order_id
        self.branch_location = branch_location
        self.branch_name = branch_name
    
    def change_order_status(self):
        # change start and end times
        if self.status is None:
            self.start_date = datetime.now()
        if self.status == Available_Order_Status.In_Progress:
            self.end_date = datetime.now()
        # change order status
        if self.status == Available_Order_Status.In_Progress:
            self.status = Available_Order_Status.Done
        if self.status is None:
            self.status = Available_Order_Status.In_Progress
        

    def order_details(self):
        return {'date': str(self.date), 'toppings': str(self.toppings),
        'branch_id' : str(self.branch_id),
        'unique_order_id' : str(self.unique_order_id),
        'branch_location' : str(self.branch_location),
        'branch_name' : str(self.branch_name),
        'status' : str(self.status)}



    






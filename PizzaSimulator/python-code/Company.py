import random
from Branch import *
import asyncio

class Company:
    def __init__(self, n_branches, company_name) -> None:
        self.n_branches = n_branches
        self.company_name = company_name
        self.branches = []
        self.work_slack_range = 1
        self.make_branches()
    def make_branches(self):
        order_range = 10
        for i in range(self.n_branches):
            average_orders = random.randint(2, order_range)
            work_slack = random.random() * self.work_slack_range
            branch_location = Available_Branch_Locations(random.randint(1, len(Available_Branch_Locations))).name
            branch = Branch(average_orders= average_orders, branch_id=i,
                             branch_location= branch_location, branch_name= self.company_name + '_' + branch_location + '_' + str(i),
                             worker_slack=work_slack * 60)
            self.branches.append(branch)

    async def start(self):
        # get the coroutine objects
        lst = []
        for branch in self.branches:
            lst.append(threading.Thread(target=branch.work))
        for branch_worker in lst: branch_worker.start()
        for branch_worker in lst: threading.Thread.join(branch_worker)




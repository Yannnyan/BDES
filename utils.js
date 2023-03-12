


function dif(time1,time2)
    {
      return new Date(Date.parse(time1) - Date.parse(time2))
    }

function Format_Order_Mongo(order)
{
    order.start_date = new Date(Date.parse(order.start_date));
    order.end_date = new Date(Date.parse(order.end_date));
    order.toppings = Array.isArray(order.toppings) ? order.toppings : [order.toppings];
    order.branch_id = Number(order.branch_id);

    return order
}
export{dif, Format_Order_Mongo}




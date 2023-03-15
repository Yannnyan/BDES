
import { Get_Orders, Save_Order } from "../db/mongo.js";
import { Format_Order_Mongo } from "../utils.js";
import { create_association, retrieve_associations, write_to_CSV } from "../ML/bigml.js";
class AnalizeLogic
{
    constructor(){

    }

    process_order(order)
    {
        if(order.status.endsWith('In_Progress'))
        {
            return
        }
        Save_Order(Format_Order_Mongo(order))
    }

    async Get_Association_Rules(start_date, end_date, calback)
    {
        await Get_Orders(start_date, end_date)
        .then(async (orders) => {
            if(orders.length < 100)
            {
                // not enough for association rules
                calback(
                    {
                        error: 'not enough records for association rules'
                    })
            }
            else{
                await write_to_CSV(orders, function() {
                    create_association(function() {
                        retrieve_associations(calback)
                    })
                })
            }
        })
        
    }

}

export {AnalizeLogic}









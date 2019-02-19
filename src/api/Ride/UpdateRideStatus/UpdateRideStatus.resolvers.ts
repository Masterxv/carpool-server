import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import { UpdateRideStatusMutationArgs, UpdateRideStatusRsponse } from "../../../types/graph";
import Ride from "../../../entities/Ride";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async(
        _, 
        args: UpdateRideStatusMutationArgs, 
        {req, pubSub}
      ) : Promise<UpdateRideStatusRsponse> => {
      const user: User = req.user;
      if(user.isDriving){
        try{
          let ride : Ride | undefined;
          if(args.status === "ACCEPTED"){
            const ride = await Ride.findOne({
              id: args.rideId,
              status: "REQUESTING"
            }, {relations: ["passenger"]});    
            if(ride){
              ride.driver = user;
              user.isTaken = true;
              user.save();
              await Chat.create({
                driver: user,
                passenger: ride.passenger
              }).save();
            }
          }else{
            ride = await Ride.findOne({
              id: args.rideId,
              driver: user
            });
          }
          if(ride){
            ride.status = args.status
            ride.save();
            pubSub.publish("rideUpdate",{RideStatusSubscription: ride});
            return {
              ok:true,
              error: null
            }
          }else{
            return{
              ok: false,
              error: "Can't update ride"
            }
          }
        }catch(error){
          return{
            ok: false,
            error: error.message
          }
        }
      }else{
        return{
          ok: false,
          error: "You are not driving"
        }
      }
    })
  }
}
export default resolvers;
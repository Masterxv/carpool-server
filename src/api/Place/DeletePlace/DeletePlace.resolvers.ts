import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolvers";
import User from "../../../entities/User";
import { DeletePlaceMutationArgs, DeletePlaceResponse } from "../../../types/graph";
import Place from "../../../entities/Place";

const resolvers: Resolvers = {
  Mutation: {
    DeletePlace: privateResolver(
      async(
        _, 
        args: DeletePlaceMutationArgs, 
        {req}
        ) : Promise<DeletePlaceResponse> => {
      const user: User = req.user;
      try{
        const place = await Place.findOne({id: args.placeId});
        if(place){
          if(place.userId === user.id){
            place.remove();
            return {
              ok: true,
              error: null
            }
          }else {
            return {
              ok: false,
              error: "Not Authrized"
            }
          }
        }else{
          return {
            ok: false,
            error: "Place not found"
          }
        }
      }catch(error){
        return {
          ok: false,
          error: null
        }
      }
    })
  }
}

export default resolvers;
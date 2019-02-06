import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolvers";
import { UpdateMyPrifileMutationArgs } from "../../../types/graph";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(async(_,args: UpdateMyPrifileMutationArgs, {req} )=> {
      const user: User = req.user;
      const notNull:any = cleanNullArgs(args); // 👈

      if(notNull.password !== null){
        user.password = notNull.password;
        user.save();
        delete notNull.password;
      }
      try{
        await User.update({id: user.id},{...notNull});
        // if(args.password !== null){
        //   user.password = args.password;
        //   user.save();
        // }
        return {
          ok: true,
          error: null
        }
      }catch(error){
        return{
          ok: false,
          error: error.message  
        }
      }
    })
  }
};
export default resolvers;
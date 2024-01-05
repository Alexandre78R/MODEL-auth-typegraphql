//backend/src/lib/authChecker.ts
import { AuthChecker } from "type-graphql";
import { MyContext } from "..";

export const customAuthChecker: AuthChecker<MyContext> = (
    { context },
    roles
  ) => {
    // console.log(roles)
    if (context.user && roles.includes(context.user.role) || context.user &&  roles.length === 0) { // on peut imaginer que si le user n'est pas null et qu'il a le rôle faisant partie du tableau de rôle indiqué dans le décorateur Authorized(["MANAGER"]) on le laisse passer 
      return true;
    }

    throw new Error(
        "Vous devez être authentifié pour avoir accès a cette fonctionnalité !"
      );
  };
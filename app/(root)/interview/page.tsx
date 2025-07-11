import { redirect } from "next/navigation";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  if (!user?.id) {
    redirect("/sign-in");
  }
  
  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user?.name!}
        userId={user?.id!}
        
        type="generate"
        
      />
    </>
  );
};

export default Page;
import Authprovider from "../authprovider";


export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authprovider allowedRoles={["manager"]}>
      {children}
    </Authprovider>
  );
}

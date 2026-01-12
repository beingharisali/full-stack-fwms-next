import Authprovider from "../authprovider";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authprovider allowedRoles={["admin"]}>
      {children}
    </Authprovider>
  );
}

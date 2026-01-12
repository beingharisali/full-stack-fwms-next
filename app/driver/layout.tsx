import Authprovider from "../authprovider";


export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authprovider allowedRoles={["driver"]}>
      {children}
    </Authprovider>
  );
}

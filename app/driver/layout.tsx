import Authprovider from "../authprovider";

export default function DriverLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Authprovider allowedRoles={["admin"]}>{children}</Authprovider>;
}

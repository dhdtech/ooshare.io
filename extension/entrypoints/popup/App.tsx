import Card from "@ui/components/ui/Card";
import Logo from "@ui/components/ui/Logo";

export default function App() {
  return (
    <Card className="create-wrap">
      <Logo size={24} to={false} />
      <p style={{ marginTop: 8 }}>ooshare extension — scaffold OK</p>
    </Card>
  );
}

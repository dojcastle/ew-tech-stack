interface IconProps {
  icon: React.ReactElement;
}

export default function Icon(props: IconProps) {
  return <span className="icon">{props.icon}</span>;
}

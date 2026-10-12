import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Nav } from "../App.jsx";
import { WorksWheel } from "@/components/ui/works-wheel";
import { products, DEFAULT_IMAGE } from "@/data/products";

export default function Products() {
  const nav = useNavigate();
  const items = useMemo(
    () => products.map((p) => ({ title: p.name, image: p.image ?? DEFAULT_IMAGE, href: `/products/${p.slug}` })),
    []
  );

  return (
    <>
      <Nav />
      <WorksWheel
        items={items}
        label="Our builds"
        action="View"
        className="h-[calc(100vh-74px)]"
        onOpen={(item) => nav(item.href)}
      />
    </>
  );
}

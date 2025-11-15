-- Create function with min_quantity
create or replace function full_products(keyword text)
returns table (
  id uuid,
  name text,
  category text,
  unit text,
  price numeric,
  transport_price numeric,
  quantity numeric,
  min_quantity numeric
) as $$
  select 
    p.id,
    p.name,
    p.category,
    p.unit,
    pr.price,
    pr.transport_price,
    s.quantity,
    s.min_quantity
  from materials_prices pr
  inner join materials_products p on pr.product_id = p.id
  inner join materials_stock s on pr.product_id = s.product_id
  where p.name ilike '%' || keyword || '%';
$$ language sql stable;

-- Add min_quantity column if not exists
alter table materials_stock
add column if not exists min_quantity numeric;

-- Function to update a full product across related tables
create or replace function update_full_product(
  product_id uuid,
  name text,
  category text,
  unit text,
  price numeric,
  transport_price numeric,
  min_quantity numeric,
  quantity numeric
)
returns void as $$
begin
  -- Update materials_products
  update materials_products
  set 
    name = update_full_product.name,
    category = update_full_product.category,
    unit = update_full_product.unit,
    "updatedAt" = now()
  where id = update_full_product.product_id;

  -- Update materials_prices
  update materials_prices
  set
    price = update_full_product.price,
    transport_price = update_full_product.transport_price
  where product_id = update_full_product.product_id;

  -- Update materials_stock
  update materials_stock
  set
    min_quantity = update_full_product.min_quantity,
    quantity = update_full_product.quantity
  where product_id = update_full_product.product_id;
end;
$$ language plpgsql volatile;

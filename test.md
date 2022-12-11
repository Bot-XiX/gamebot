Neues Angebot im Rewe Prospekt für
    {%- set product_list_loop =  state_attr('sensor.rewe_4040248', 'discounts') -%}
    {%- for product in product_list_loop -%}

    - {{product.product }}
    Preis: {{product.price.price }} €
    Bild: 
  <div style="text-align:center">
      <img src="{{ product.picture_link }}" alt="Produkt Bild"/>
  </div>
    {%- endfor -%}
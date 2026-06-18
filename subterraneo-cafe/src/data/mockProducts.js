export const mockProducts = [
  {
    id: "1",
    name: "Espresso",
    description: "Shot doble de café de especialidad, intenso y equilibrado.",
    price: 45,
    category: "Café Caliente",
    imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
    available: true,
    options: [
      { label: "Tamaño", choices: ["Simple", "Doble"], required: true }
    ]
  },
  {
    id: "2",
    name: "Latte",
    description: "Espresso con leche vaporizada y una capa de espuma cremosa.",
    price: 70,
    category: "Café Caliente",
    imageUrl: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400",
    available: true,
    options: [
      { label: "Tamaño", choices: ["12oz", "16oz"], required: true },
      { label: "Leche", choices: ["Entera", "Oat", "Almendra"], required: false },
      { label: "Extras", choices: ["Shot extra", "Caramelo", "Vainilla"], required: false }
    ]
  },
  {
    id: "3",
    name: "Cappuccino",
    description: "Espresso, leche vaporizada y abundante espuma.",
    price: 68,
    category: "Café Caliente",
    imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
    available: true,
    options: [
      { label: "Tamaño", choices: ["12oz", "16oz"], required: true },
      { label: "Leche", choices: ["Entera", "Oat", "Almendra"], required: false }
    ]
  },
  {
    id: "4",
    name: "Americano",
    description: "Espresso diluido en agua caliente, suave y aromático.",
    price: 55,
    category: "Café Caliente",
    imageUrl: "https://images.unsplash.com/photo-1521302200778-33500795e128?w=400",
    available: true,
    options: [
      { label: "Tamaño", choices: ["12oz", "16oz"], required: true }
    ]
  },
  {
    id: "5",
    name: "Cold Brew",
    description: "Café infusionado en frío por 18 horas, suave y concentrado.",
    price: 75,
    category: "Café Frío",
    imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
    available: true,
    options: [
      { label: "Extras", choices: ["Leche", "Jarabe de vainilla", "Leche de oat"], required: false }
    ]
  },
  {
    id: "6",
    name: "Iced Latte",
    description: "Espresso sobre hielo con leche fría, refrescante y cremoso.",
    price: 72,
    category: "Café Frío",
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400",
    available: true,
    options: [
      { label: "Leche", choices: ["Entera", "Oat", "Almendra"], required: false },
      { label: "Extras", choices: ["Caramelo", "Vainilla", "Shot extra"], required: false }
    ]
  },
  {
    id: "7",
    name: "Matcha Latte",
    description: "Matcha ceremonial japonés con leche vaporizada.",
    price: 78,
    category: "Café Frío",
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400",
    available: true,
    options: [
      { label: "Temperatura", choices: ["Caliente", "Frío"], required: true },
      { label: "Leche", choices: ["Entera", "Oat", "Almendra"], required: false }
    ]
  },
  {
    id: "8",
    name: "Tostada Francesa",
    description: "Pan brioche con huevo, canela y miel de maple.",
    price: 95,
    category: "Comida",
    imageUrl: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400",
    available: true,
    options: []
  },
  {
    id: "9",
    name: "Avocado Toast",
    description: "Pan artesanal con aguacate, limón, chile y semillas.",
    price: 110,
    category: "Comida",
    imageUrl: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400",
    available: true,
    options: [
      { label: "Extras", choices: ["Huevo estrellado", "Queso feta", "Tomate cherry"], required: false }
    ]
  },
  {
    id: "10",
    name: "Croissant de Almendra",
    description: "Croissant hojaldrado relleno de crema de almendra.",
    price: 65,
    category: "Panadería",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    available: true,
    options: []
  },
  {
    id: "11",
    name: "Muffin de Arándano",
    description: "Muffin esponjoso con arándanos frescos y azúcar glass.",
    price: 55,
    category: "Panadería",
    imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400",
    available: true,
    options: []
  },
  {
    id: "12",
    name: "Agua de Jamaica",
    description: "Agua fresca de flor de jamaica natural, sin azúcar añadida.",
    price: 40,
    category: "Otros",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    available: true,
    options: []
  }
];

export const categories = ["Todos", "Café Caliente", "Café Frío", "Comida", "Panadería", "Otros"];
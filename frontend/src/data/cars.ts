import type { Car } from "@/lib/types";

/** Fleet listings — edit or add vehicles here. */
export const CARS: Car[] = [
  {
    id: 1,
    title: "2022 Mercedes-Benz S-Class Limo",
    make: "Mercedes-Benz",
    model: "S-Class",
    year: 2022,
    body_type: "Limo",
    price: 450000,
    description:
      "Executive stretch limousine perfect for weddings, corporate events, and VIP airport transfers. Leather interior, climate control, premium sound system, and professional chauffeur-ready configuration.",
    status: "available",
    images: ["/images/fleet/limo.jpg"],
    mileage: 12000,
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: 2,
    title: "2021 Toyota Camry — Executive Sedan",
    make: "Toyota",
    model: "Camry",
    year: 2021,
    body_type: "Sedan",
    price: 85000,
    description:
      "Reliable executive sedan for business travel and daily hire. Fuel-efficient, comfortable seating for 5, and well maintained.",
    status: "available",
    images: ["/images/fleet/sedan.jpg"],
    mileage: 28000,
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: 3,
    title: "2023 Range Rover Sport SUV",
    make: "Land Rover",
    model: "Range Rover Sport",
    year: 2023,
    body_type: "SUV",
    price: 320000,
    description:
      "Premium SUV for events, road trips, and luxury transfers. All-wheel drive, panoramic roof, and spacious cargo area.",
    status: "available",
    images: ["/images/fleet/suv.jpg"],
    mileage: 8000,
    fuel: "Petrol",
    transmission: "Automatic",
  },
  {
    id: 4,
    title: "2020 Ford F-150 Pickup",
    make: "Ford",
    model: "F-150",
    year: 2020,
    body_type: "Truck",
    price: 120000,
    description:
      "Heavy-duty pickup for logistics, construction site visits, and cargo transport.",
    status: "sold",
    images: ["/images/fleet/truck.jpg"],
    mileage: 45000,
    fuel: "Petrol",
    transmission: "Automatic",
  },
];

import enterpriseImage from "./public/assets/enterprise.png";
import professionalImage from "./public/assets/professional.png";
import starterImage from "./public/assets/starter.png";

export const pricingData = [
  {
    index: 1,
    title: "Starter",
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    price: 15,
    text: (
      <>
        Single-User <b>Database</b>
      </>
    ),
    planName: "Starter",
    img: starterImage,
  },
  {
    index: 2,
    title: "Professional",
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
    price: 25,
    text: (
      <>
        Team <b>Database</b>
      </>
    ),
    subText: "Up to 6 users",
    planName: "Professional",
    img: professionalImage,
  },
  {
    index: 3,
    title: "Enterprise",
    text: "Contact Us",
    subText: "Unlimited Users",
    planName: "enterprise",
    img: enterpriseImage,
  },
];

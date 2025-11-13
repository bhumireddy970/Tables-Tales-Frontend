import Dosa from '../assets/dosa.jpg';
import Chola from '../assets/chhola.jpg';
import Idli from '../assets/idli.jpg';
import MasalaDosa from '../assets/masala.jpg';
import Paneer from '../assets/paneer.jpg';
import GujaratiThali from '../assets/gujrati.jpeg';

export const MenuList = [
    {
        name: "Dosa",
        description: "A crispy and savory South Indian pancake served with chutneys and sambar.",
        image: Dosa,
        category:'Tiffins',
        price: 40,
    },
    {
        name: "Chola",
        description: "Spicy and flavorful chickpea curry, often paired with bhatura or rice.",
        image: Chola,
        category:'Tiffins',
        price: 100,
    },
    {
        name: "Idli",
        description: "Soft and fluffy steamed rice cakes, a healthy and traditional South Indian breakfast.",
        image: Idli,
        category:'Tiffins',
        price: 30,
    },
    {
        name: "Masala Dosa",
        description: "A classic dosa stuffed with a spicy potato filling, served with chutney and sambar.",
        image: MasalaDosa,
        category:'Special',
        price: 50,
    },
    {
        name: "Paneer Butter Masala",
        description: "Rich and creamy paneer curry with a buttery tomato-based gravy.",
        image: Paneer,
        category:'Tiffins',
        price: 60,
    },
    {
        name: "Gujarati Thali",
        description: "A wholesome platter featuring an assortment of Gujarati dishes.",
        image: GujaratiThali,
        category:'Tiffins',
        price: 80,
    }
];

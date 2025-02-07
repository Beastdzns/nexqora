import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Fragment } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { IoChevronDownOutline } from "react-icons/io5";

const Navbar = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { pathname } = useRouter();
  const [navbarBg, setNavbarBg] = useState("bg-transparent");
  const [navbarOpacity, setNavbarOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const triggerHeight = 50;

      // Calculate opacity based on scroll position
      const opacity = Math.min(scrollY / triggerHeight, 1);

      if (scrollY > triggerHeight) {
        setNavbarBg("bg-gray-900 shadow-lg");
      } else {
        setNavbarBg("bg-transparent");
      }

      setNavbarOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ${navbarBg} p-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-lg transition-opacity duration-300`}
      style={{ opacity: 1 - navbarOpacity }} // Apply fading effect here
    >
      <div className="max-w-[1080px] mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/tt.jpg"
            width="40"
            height="40"
            alt="TokenTechies"
            className="mr-3"
          />
          <span className="text-white text-2xl font-extrabold text-shadow-lg hover:text-teal-300 transition-all duration-300">
            TokenTechies
          </span>
        </Link>
        <div className="hidden md:flex md:items-center space-x-6">
          <w3m-button />
          <Link
            href="/"
            className={`text-white px-4 py-2 rounded-lg ${pathname === "/" ? "underline text-teal-400" : "hover:text-teal-400"} transition-all duration-300 transform hover:scale-105`}
          >
            Home
          </Link>
          <Link
            href="/create"
            className={`text-white px-4 py-2 rounded-lg ${pathname === "/create" ? "underline text-teal-400" : "hover:text-teal-400"} transition-all duration-300 transform hover:scale-105`}
          >
            Zerogas
          </Link>
          <Link
            href="/invest"
            className={`text-white px-4 py-2 rounded-lg ${pathname === "/invest" ? "underline text-teal-400" : "hover:text-teal-400"} transition-all duration-300 transform hover:scale-105`}
          >
            Invest
          </Link>
          <Menu as="div" className="relative">
            <Menu.Button className="text-white px-4 py-2 inline-flex items-center rounded-lg hover:bg-gray-700 transition-all duration-300">
              Profile <IoChevronDownOutline className="ml-2" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/bucket"
                      className={`${
                        active ? "bg-teal-500 text-white" : "text-gray-900"
                      } block px-4 py-2`}
                    >
                      Your Bucket
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpenMenu(!isOpenMenu)}
        >
          <HiMenuAlt3 size={25} />
        </button>
      </div>
      {isOpenMenu && (
        <div className="md:hidden bg-gray-900 p-4">
          <w3m-button />
          <Link
            href="/"
            className={`block text-white py-2 ${pathname === "/" ? "underline" : "hover:text-teal-400"}`}
          >
            Home
          </Link>
          <Link
            href="/create"
            className={`block text-white py-2 ${pathname === "/create" ? "underline" : "hover:text-teal-400"}`}
          >
            Zerogas
          </Link>
          <Link
            href="/invest"
            className={`block text-white py-2 ${pathname === "/invest" ? "underline" : "hover:text-teal-400"}`}
          >
            Invest
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

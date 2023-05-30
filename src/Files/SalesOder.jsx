import { useState } from "react";
//import { Link } from "react-router-dom";
import {
  FaTrash,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaPrint,
  //FaCog,
  //FaFileInvoice,
} from "react-icons/fa";
//import addStyle from "./AddCustomer.model.css";
// import { fetchCustomer } from "../services/api-calls";
import useSWR from "swr";
import {
  fetchOrdersMeta,
  fetchProducts,
  fetchCustomer,
  createOrder,
} from "../services/api-calls";
import { toast } from "react-toastify";
import { useCart } from "../context/CartProvider";

const SalesOrder = () => {
  const { data, isLoading } = useSWR("/products", fetchProducts);
  const { data: customers } = useSWR("/customers", fetchCustomer);
  const {
    state: cartState,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getQuantity,
    emptyCart,
  } = useCart();

  //
  const formArray = [1, 2, 3];
  const [formNo, setFormNo] = useState(formArray[0]);
  const [state, setState] = useState({
    query: "",
    customer: "",
    discount: "",
  });
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const next = () => {
    if (formNo === 1) {
      setFormNo(formNo + 1);
    } else if (formNo === 2 && state.customer) {
      setFormNo(formNo + 1);
    } else {
      toast.error("Please fill all the fields");
    }
  };
  const finalSubmit = async (e) => {
    e.preventDefault();
    // cartState have items array and contains array of object so ineed to map it and only id of array
    const items = cartState.items.map((item) => item._id);

    const reqObject = {
      customer: state.customer,
      items,
      total: cartState.total,
      orderedBy: "645f863d4cb4f73cfd963910",
    };

    const res = await createOrder(reqObject);
    toast.success(res.message);
    // resetForm();
    emptyCart();
    setState({
      query: "",
      customer: "",
      discount: "",
    });

    setFormNo(formArray[0]);
  };

  const pre = () => {
    setFormNo(formNo - 1);
  };

  const searchingProduct = filteredArray(data, state.query);

  const getCustomerName = (id) => {
    const customer = customers?.find((customer) => customer._id === id);
    return customer?.name;
  };

  return (
    <div class="hide-print flex flex-row h-screen antialiased text-blue-gray-800">
      <div class="flex flex-row w-auto flex-shrink-0 pl-4 pr-2 py-4">
        {/* <div class="flex flex-col items-center py-4 flex-shrink-0 w-20 bg-gray-600 rounded-3xl">
          <Link
            href="#"
            class="flex items-center justify-center h-12 w-12 bg-cyan-50 text-gray-700 rounded-full"
          >
            <FaFileInvoice className="w-6 h-6" />
          </Link>
          <ul class="flex flex-col space-y-2 mt-12">
            <li>
              <Link href="#" class="flex items-center">
                <span class="flex items-center justify-center h-12 w-12 rounded-2xl text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </span>
              </Link>
            </li>
            <li>
              <Link href="#" class="flex items-center">
                <span class="flex items-center justify-center text-cyan-100 hover:bg-cyan-400 h-12 w-12 rounded-2xl">
                  <FaCog className="w-6 h-6" />
                </span>
              </Link>
            </li>
          </ul>
        </div> */}
      </div>
      {/* content menu */}
      {formNo === 1 && (
        <div class="flex-grow flex">
          <div class="flex flex-col bg-blue-gray-50 h-full w-full py-4">
            <div class="flex px-2 flex-row relative">
              <div class="absolute left-5 top-3 px-2 py-2 rounded-full bg-gray-500 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                class="bg-white rounded-3xl shadow text-lg full w-full h-16 py-4 pl-16 transition-shadow focus:shadow-2xl focus:outline-none"
                placeholder="Cari menu ..."
                //x-model="keyword"

                onChange={inputHandle}
                name="query"
                value={state.query}
              />
            </div>
            <div className="h-full overflow-hidden mt-4">
              <div className="h-full overflow-y-auto px-2">
                <div class="grid grid-cols-3 gap-4 pb-3 ">
                  {isLoading && <p>Loading...</p>}
                  {searchingProduct?.map((product) => {
                    const { _id, name, cost, image } = product;
                    return (
                      <div
                        key={_id}
                        class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                        role="button"
                      >
                        <div class="flex items-center justify-between px-4 py-3 border-b">
                          <img
                            class="p-8 rounded-t-lg"
                            src={
                              image ||
                              "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a50-sm-a505f-ds-1.jpg"
                            }
                            alt=""
                          />
                        </div>
                        <div class="px-5 pb-5">
                          <div className="flex justify-between">
                            <h5 class="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                              {name}
                            </h5>
                          </div>

                          <div class="flex justify-between mt-2">
                            <span class="text-2xl font-bold text-gray-900 dark:text-white">
                              ${cost}
                            </span>
                            <button
                              onClick={() => {
                                addToCart(product);
                              }}
                              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
                            >
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col w-[50%] bg-white rounded-3xl shadow-lg">
            <div class="flex flex-row justify-between items-center px-4 py-3 border-b">
              <button
                onClick={() => {
                  emptyCart();
                }}
                class="flex items-center justify-center px-4 py-2 text-sm text-red-500 rounded-md"
              >
                <FaTrash className="w-4 h-4 mr-2" />
              </button>

              <button
                class="flex items-center justify-center px-4 py-2 text-sm text-green-600 rounded-md"
                onChange={addToCart}
              >
                <FaShoppingCart className="w-4 h-4 mr-2" />
                <span class="font-medium text-gray-900 ">
                  {cartState.items.length}
                </span>
              </button>
            </div>

            <div class="flex flex-col flex-grow overflow-hidden">
              <div class="flex flex-col flex-grow overflow-y-auto">
                <div class="flex flex-col">
                  {cartState.items.map((product) => {
                    return (
                      <div
                        key={product._id}
                        class="flex flex-row justify-between items-center px-4 py-3 border-b bg-gray-100 m-3"
                      >
                        <div className="flex items-center">
                          <img
                            src={
                              product.image ||
                              "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-a50-sm-a505f-ds-1.jpg"
                            }
                            alt=""
                            className="object-cover w-12 h-12"
                          />
                          <div className="ml-2">
                            <p className="text-sm font-semibold">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.cost}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              decrementQuantity();
                            }}
                            className="text-gray-600 hover:text-gray-800  font-bold py-2 px-4 rounded-full"
                          >
                            <FaMinus />
                          </button>
                          <p className="px-2">{getQuantity(product._id)}</p>
                          <button
                            onClick={() => {
                              incrementQuantity();
                            }}
                            className="text-gray-600 hover:text-gray-800   font-bold py-2 px-4 rounded-full"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div class="flex flex-row justify-between items-center px-4 py-3 border-t">
              <p class="text-xl font-semibold">Total</p>
              <p class="text-xl font-semibold">${cartState.total}</p>
            </div>

            <div class="flex flex-row justify-between items-center px-4 py-3 border-t">
              <button
                class="flex items-center justify-center px-4 py-2 text-white font-bold w-full bg-gray-700 rounded-md "
                onClick={next}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {formNo === 2 && (
        <div className=" rounded-3xl shadow-lg h-52 flex justify-center m-28 w-full">
          <div className="w-[50%]">
            <div className="flex flex-row justify-between items-center px-4 py-3 border-b">
              <label className="text-xl font-semibold ml-0">
                Customer Name
              </label>
              <select
                className="border border-gray-300 rounded-md px-2 py-1 w-[67%]"
                onChange={inputHandle}
                name="customer"
                value={state.customer}
              >
                <option value="" disabled>
                  Select Customer
                </option>
                {customers.map((customer) => (
                  <option value={customer._id}>{customer.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-row justify-between items-center px-4 py-3 border-b gap-3">
              <button
                class="flex items-center justify-center px-4 py-2 text-white font-bold w-full bg-gray-700 rounded-md "
                onClick={pre}
              >
                Previous
              </button>
              <button
                class="flex items-center justify-center px-4 py-2 text-white font-bold w-full bg-gray-700 rounded-md "
                onClick={next}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {formNo === 3 && (
        <div className=" rounded shadow-lg h-screen mt-4   border-spacing-1 bg-white w-[100%] flex justify-center items-center">
          <form className="w-[50%] overflow-x-auto ">
            {/* <span className="text-sm font-semibold ml-2 mt-8 ">
              Customer Name: {getCustomerName(state.customer)}
            </span> */}

            <div className="overflow-x-auto ">
              <span className="text-sm font-semibold ml-2 mt-8 ">
                Customer Name: {getCustomerName(state.customer)}
              </span>
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100 text-white" id="">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      scope="col"
                    >
                      item
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      scope="col"
                    >
                      Quantity
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      scope="col"
                    >
                      price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartState.items.map((item) => {
                    return (
                      <tr key={item._id} className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.cost * item.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col justify-between items-center px-4 py-3 border-b">
              <div className="flex-row justify-between flex items-center w-full">
                <p className="text-xl font-semibold">Discount</p>
                <p className="text-xl font-semibold">{cartState.discount}</p>
              </div>
              <div className="flex-row justify-between flex items-center w-full">
                <p className="text-xl font-semibold">SubTotal </p>
                <p className="text-xl font-semibold">{cartState.subTotal}</p>
              </div>
              <div className="flex-row justify-between flex items-center w-full">
                <p className="text-xl font-semibold">Total</p>
                <p className="text-xl font-semibold">{cartState.total}</p>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center px-4 py-3 border-b">
              <button
                class="flex items-center justify-center px-4 py-2 text-white font-bold w-[30%] bg-gray-700 rounded-md "
                onClick={pre}
              >
                Previous
              </button>

              <button
                class="flex items-center justify-center px-4 py-2 text-white font-bold w-[30%] bg-gray-700 rounded-md "
                onClick={finalSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
  function filteredArray(arr, query) {
    return arr?.filter((el) => {
      return el.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
  }
};

export default SalesOrder;

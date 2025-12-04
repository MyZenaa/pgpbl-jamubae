import { realtimeDB } from "../firebaseConfig";
import { ref, get, set, update, remove, onValue } from "firebase/database";

const CART_PATH = "cart/";

const cartService = {
  /**
   * LISTEN CART REALTIME
   */
  listenCart(callback: (items: any[]) => void) {
    const cartRef = ref(realtimeDB, CART_PATH);

    const unsubscribe = onValue(cartRef, (snap) => {
      const data = snap.val() || {};

      const items = Object.keys(data).map((key) => ({
        id: key,
        name: data[key].name,
        price: data[key].price,
        quantity: data[key].quantity ?? 1,
        image: data[key].image ?? null,
      }));

      callback(items);
    });

    return unsubscribe;
  },

  /**
   * ADD ITEM TO CART
   */
  async add(item: any) {
    const itemRef = ref(realtimeDB, CART_PATH + item.id);
    const snap = await get(itemRef);

    if (snap.exists()) {
      await update(itemRef, {
        quantity: (snap.val().quantity ?? 1) + 1,
      });
    } else {
      await set(itemRef, {
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image ?? null,
      });
    }
  },

  /**
   * UPDATE QUANTITY
   */
  async updateQuantity(id: string, qty: number) {
    const itemRef = ref(realtimeDB, CART_PATH + id);

    if (qty <= 0) {
      await remove(itemRef);
    } else {
      await update(itemRef, { quantity: qty });
    }
  },

  /**
   * REMOVE ITEM
   */
  async remove(id: string) {
    const itemRef = ref(realtimeDB, CART_PATH + id);
    await remove(itemRef);
  },
};

export default cartService;

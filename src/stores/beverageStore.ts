import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import { db, auth } from "../firebase.ts";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    Temps: tempretures,
    currentTemp: tempretures[0],

    Base: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,

    Cream: [] as CreamerType[],
    currentCream: null as CreamerType | null,

    Syrup: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,

    savedBeverages: [] as {
      id: string;
      name: string;
      temp: string;
      baseId: string;
      creamId: string;
      syrupId: string;
    }[],
  }),

  actions: {
    async loadIngredients() {
      console.log("Loading ingredients…");

      const baseSnap = await getDocs(collection(db, "Bases"));
      const creamSnap = await getDocs(collection(db, "Creamers"));
      const syrupSnap = await getDocs(collection(db, "Syrups"));

      this.Base = baseSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as BaseBeverageType[];
      this.Cream = creamSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as CreamerType[];
      this.Syrup = syrupSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as SyrupType[];

      if (this.Base.length > 0) this.currentBase = this.Base[0];
      if (this.Cream.length > 0) this.currentCream = this.Cream[0];
      if (this.Syrup.length > 0) this.currentSyrup = this.Syrup[0];
    },

    async loadSavedBeverages() {
      const user = auth.currentUser;
      if (!user) {
        console.warn("No user logged in – cannot load beverages.");
        this.savedBeverages = [];
        return;
      }

      const snapshot = await getDocs(collection(db, "users", user.uid, "beverages"));
      this.savedBeverages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as {
          name: string;
          temp: string;
          baseId: string;
          creamId: string;
          syrupId: string;
        })
      }));

      console.log("Loaded beverages:", this.savedBeverages);
    },

    async makeBeverage(name: string) {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in – cannot save beverage.");
        return;
      }

      const id = crypto.randomUUID(); // unique drink ID
      const newBeverage = {
        name,
        temp: this.currentTemp,
        baseId: this.currentBase!.id,
        creamId: this.currentCream!.id,
        syrupId: this.currentSyrup!.id,
      };

      await setDoc(doc(db, "users", user.uid, "beverages", id), newBeverage);

      this.savedBeverages.push({ id, ...newBeverage });
      console.log("Beverage saved:", newBeverage);
    },

    async deleteBeverage(id: string) {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in – cannot delete beverage.");
        return;
      }

      await deleteDoc(doc(db, "users", user.uid, "beverages", id));
      this.savedBeverages = this.savedBeverages.filter(b => b.id !== id);

      console.log("Beverage deleted:", id);
    },

    showBeverage(id: string) {
      const bev = this.savedBeverages.find(b => b.id === id);
      if (!bev) return;

      this.currentTemp = bev.temp;
      this.currentBase = this.Base.find(b => b.id === bev.baseId)!;
      this.currentCream = this.Cream.find(c => c.id === bev.creamId)!;
      this.currentSyrup = this.Syrup.find(s => s.id === bev.syrupId)!;
    },
  },

  persist: false,
});

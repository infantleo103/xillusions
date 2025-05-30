"use client"

import type React from "react"

import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface CustomizationData {
  elements: Array<{
    id: string
    type: "text" | "logo"
    content: string
    x: number
    y: number
    width: number
    height: number
    rotation: number
    fontSize?: number
    fontFamily?: string
    color?: string
    zIndex: number
    side?: "front" | "back"
    originalImageUrl?: string // Original URL of uploaded image
  }>
  previewImage?: string // Final preview image of the customized product
  frontPreviewImage?: string // Preview image of the front side
  backPreviewImage?: string // Preview image of the back side
  productId: number
  originalProductImage?: string // Original product image URL
}

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
  customization?: CustomizationData
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> & { quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      try {
        console.log("Cart reducer: ADD_ITEM action received", action.payload);
        
        // For custom items, don't try to find existing items - always add as new
        if (action.payload.customization) {
          console.log("Custom item detected, adding as new item");
          const newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
          
          console.log("New cart items:", newItems);
          return {
            ...state,
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
          };
        }
        
        // For regular items, check if it already exists
        const existingItem = state.items.find(
          (item) =>
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color &&
            !item.customization // Only match non-customized items
        );

        if (existingItem) {
          console.log("Existing item found, updating quantity");
          const updatedItems = state.items.map((item) =>
            item.id === action.payload.id &&
            item.size === action.payload.size &&
            item.color === action.payload.color &&
            !item.customization
              ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
              : item,
          );
          
          console.log("Updated cart items:", updatedItems);
          return {
            ...state,
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          };
        }

        console.log("New regular item, adding to cart");
        const newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
        
        console.log("New cart items:", newItems);
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
        };
      } catch (error) {
        console.error("Error in cart reducer:", error);
        return state;
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
        )
        .filter((item) => item.quantity > 0)

      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

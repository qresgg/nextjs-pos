import React, { useRef } from 'react'
import PinManager from '@/utils/pinManager.util'

export default function usePinManager( setUniqueNumbers: React.Dispatch<React.SetStateAction<number[]>> ) {
    const manager = useRef(new PinManager()).current;

    const addWithIndex = (index: number) => {
        setUniqueNumbers((prev) => manager.addNumber(prev, index + 1))
    }

    const addZero = () => {
        setUniqueNumbers((prev) => manager.addNumber(prev, 0))
    }

    const removeLast = () => {
        setUniqueNumbers((prev) => manager.removeLast(prev))
    }

    const deleteAll = () => {
        setUniqueNumbers(manager.deleteAll())
    }

    return (
        { addWithIndex, addZero, removeLast, deleteAll }
    )
}
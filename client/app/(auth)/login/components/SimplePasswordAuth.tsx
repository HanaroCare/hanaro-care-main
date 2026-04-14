"use client";

import { motion } from "framer-motion";
import { Delete } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

type SimplePasswordAuthProps = {
	onSuccess: () => void;
};

export default function SimplePasswordAuth({ onSuccess }: SimplePasswordAuthProps) {
	const [pin, setPin] = useState<string>("");
	const [shuffledNumbers, setShuffledNumbers] = useState<string[]>([]);
	const [isMounted, setIsMounted] = useState(false);

	const getSecureShuffledArray = useCallback(() => {
		const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
		const array = [...numbers];

		for (let i = array.length - 1; i > 0; i--) {
			const randomValue = new Uint32Array(1);
			window.crypto.getRandomValues(randomValue);
			const j = randomValue[0] % (i + 1);

			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}, []);

	useEffect(() => {
		setShuffledNumbers(getSecureShuffledArray());
		setIsMounted(true);
	}, [getSecureShuffledArray]);

	useEffect(() => {
		if (pin.length === 6) {
			const timer = setTimeout(() => {
				onSuccess();
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [pin, onSuccess]);

	const handleNumberClick = (num: string) => {
		if (pin.length < 6) {
			setPin((prev) => prev + num);
		}
	};

	const handleDelete = () => {
		setPin((prev) => prev.slice(0, -1));
	};

	if (!isMounted) return <div className="h-[25rem]" />;

	return (
		<div className="flex flex-col items-center pt-[2rem]">

			<div className="mb-[4rem] flex gap-[1.25rem]">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className={`h-[1rem] w-[1rem] rounded-full border transition-all duration-200 ${pin.length > i
							? "bg-primary border-primary scale-110"
							: "bg-transparent border-gray-300"
							}`}
					/>
				))}
			</div>

			<div className="grid w-full max-w-[22rem] grid-cols-3 gap-y-[1.5rem] px-[1rem]">
				{shuffledNumbers.slice(0, 9).map((num) => (
					<motion.button
						key={num}
						whileTap={{ scale: 0.9 }}
						type="button"
						onClick={() => handleNumberClick(num)}
						className="flex h-[4rem] items-center justify-center text-[1.5rem] font-semibold text-foreground rounded-full active:bg-gray-50"
					>
						{num}
					</motion.button>
				))}

				<div className="flex h-[4rem]" />
				<motion.button
					whileTap={{ scale: 0.9 }}
					type="button"
					onClick={() => handleNumberClick(shuffledNumbers[9])}
					className="flex h-[4rem] items-center justify-center text-[1.5rem] font-semibold text-foreground rounded-full active:bg-gray-50"
				>
					{shuffledNumbers[9]}
				</motion.button>
				<motion.button
					whileTap={{ scale: 0.9 }}
					type="button"
					onClick={handleDelete}
					className="flex h-[4rem] items-center justify-center text-foreground rounded-full active:bg-gray-50"
				>
					<Delete className="h-[1.75rem] w-[1.75rem]" />
				</motion.button>
			</div>
		</div>
	);
}
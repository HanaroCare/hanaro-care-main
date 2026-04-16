"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type Point = {
	x: number;
	y: number;
	id: number;
};

type PatternAuthProps = {
	onSuccess: (value: string) => void;
};

export default function PatternAuth({ onSuccess }: PatternAuthProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

	const [dots, setDots] = useState<Point[]>([]);
	const [path, setPath] = useState<number[]>([]);
	const [isDrawing, setIsDrawing] = useState(false);
	const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		const canvas = canvasRef.current;
		if (!container || !canvas) return;

		const updateSize = () => {
			const { width, height } = container.getBoundingClientRect();
			const dpr = window.devicePixelRatio || 1;

			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);

			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;

			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			}

			const newDots: Point[] = dotsRef.current.map((dot, index) => {
				if (!dot) return { x: 0, y: 0, id: index };
				const rect = dot.getBoundingClientRect();
				const containerRect = container.getBoundingClientRect();
				return {
					x: rect.left + rect.width / 2 - containerRect.left,
					y: rect.top + rect.height / 2 - containerRect.top,
					id: index,
				};
			});
			setDots(newDots);
		};

		const resizeObserver = new ResizeObserver(() => updateSize());
		resizeObserver.observe(container);

		updateSize(); // 초기 실행

		return () => {
			resizeObserver.disconnect();
		};
	}, []);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (path.length > 0) {
			ctx.beginPath();
			ctx.strokeStyle = "#008485";
			ctx.lineWidth = 4;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";

			const firstDot = dots.find((d) => d.id === path[0]);
			if (firstDot) {
				ctx.moveTo(firstDot.x, firstDot.y);
				for (let i = 1; i < path.length; i++) {
					const dot = dots.find((d) => d.id === path[i]);
					if (dot) ctx.lineTo(dot.x, dot.y);
				}
				if (isDrawing && currentPoint) {
					ctx.lineTo(currentPoint.x, currentPoint.y);
				}
				ctx.stroke();
			}
		}
	}, [dots, path, isDrawing, currentPoint]);

	const checkCollision = useCallback((x: number, y: number) => {
		const threshold = 25;

		setPath((prevPath) => {
			const collidingDot = dots.find((dot) => {
				const dist = Math.sqrt((dot.x - x) ** 2 + (dot.y - y) ** 2);
				return dist < threshold;
			});

			if (collidingDot && !prevPath.includes(collidingDot.id)) {
				return [...prevPath, collidingDot.id];
			}
			return prevPath;
		});
	}, [dots]);

	const handleStart = (x: number, y: number) => {
		setIsDrawing(true);
		setPath([]);
		checkCollision(x, y);
	};

	const handleEnd = () => {
		setIsDrawing(false);
		if (path.length >= 4) {
			onSuccess(path.join(""));
		}
	};

	return (
		<div className="flex flex-col items-center justify-center pt-[2rem]">
			<div ref={containerRef} className="relative mx-auto w-fit">

				<div className="grid grid-cols-3 gap-[3.5rem] p-[1.5rem]">
					{Array.from({ length: 9 }).map((_, i) => (
						<div
							key={i}
							ref={(el) => { dotsRef.current[i] = el; }}
							className="relative flex h-[1.5rem] w-[1.5rem] items-center justify-center"
						>
							<div
								className={`h-[0.75rem] w-[0.75rem] rounded-full transition-colors duration-200 ${path.includes(i) ? "bg-primary" : "bg-gray-200"
									}`}
							/>
							{path.includes(i) && (
								<div className="absolute h-[2.5rem] w-[2.5rem] rounded-full bg-primary/20 animate-in fade-in zoom-in duration-200" />
							)}
						</div>
					))}
				</div>

				<canvas
					ref={canvasRef}
					className="absolute inset-0 z-10 touch-none"
					onMouseDown={(e) => {
						const rect = canvasRef.current?.getBoundingClientRect();
						if (rect) handleStart(e.clientX - rect.left, e.clientY - rect.top);
					}}
					onMouseMove={(e) => {
						if (!isDrawing) return;
						const rect = canvasRef.current?.getBoundingClientRect();
						if (rect) {
							const x = e.clientX - rect.left;
							const y = e.clientY - rect.top;
							setCurrentPoint({ x, y });
							checkCollision(x, y);
						}
					}}
					onMouseUp={handleEnd}
					onTouchStart={(e) => {
						const rect = canvasRef.current?.getBoundingClientRect();
						if (rect) handleStart(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
					}}
					onTouchMove={(e) => {
						if (!isDrawing) return;
						const rect = canvasRef.current?.getBoundingClientRect();
						if (rect) {
							const x = e.touches[0].clientX - rect.left;
							const y = e.touches[0].clientY - rect.top;
							setCurrentPoint({ x, y });
							checkCollision(x, y);
						}
					}}
					onTouchEnd={handleEnd}
				/>
			</div>

			<button
				type="button"
				onClick={() => setPath([])}
				className="mt-[3rem] text-[0.875rem] text-hana-black-500 underline underline-offset-4"
			>
				다시 그리기
			</button>
		</div>
	);
}
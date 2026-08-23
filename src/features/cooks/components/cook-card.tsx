import { MapPin } from "lucide-react";
import { Link } from "react-router";
import type { Cook } from "@/entities/cooks";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return (first + last).toUpperCase();
}

interface CookCardProps {
	cook: Cook;
}

export function CookCard({ cook }: CookCardProps) {
	return (
		<article className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-lg">
			<div className="flex items-start gap-3">
				<Avatar size="lg" className="shrink-0">
					<AvatarFallback className="bg-gradient-to-br from-primary/15 via-accent/15 to-primary/5 font-semibold text-primary">
						{getInitials(cook.displayName)}
					</AvatarFallback>
				</Avatar>

				<div className="flex min-w-0 flex-col gap-0.5">
					<h3 className="line-clamp-1 text-base font-semibold">
						{cook.displayName}
					</h3>
					{cook.publicLocation && (
						<span className="flex items-center gap-1 text-sm text-muted-foreground">
							<MapPin className="size-3.5 shrink-0" />
							<span className="line-clamp-1">{cook.publicLocation}</span>
						</span>
					)}
				</div>
			</div>

			{cook.bio && (
				<p className="line-clamp-2 text-sm text-muted-foreground">{cook.bio}</p>
			)}

			{cook.specialties.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{cook.specialties.slice(0, 4).map((specialty) => (
						<Badge
							key={specialty}
							variant="outline"
							className="h-7 px-2.5 text-xs"
						>
							{specialty}
						</Badge>
					))}
				</div>
			)}

			<Button
				type="button"
				size="sm"
				variant="outline"
				className="mt-auto"
				render={<Link to={`/search?cookId=${cook.id}`} />}
			>
				Ver productos
			</Button>
		</article>
	);
}

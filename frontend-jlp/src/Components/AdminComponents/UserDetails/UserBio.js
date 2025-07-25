import { BookOpen } from "lucide-react";
import {EmptyState} from "./EmptyState";

export const UserBio = ({ user }) => {
  if (!user.Bio) {
    return (
      <EmptyState 
        icon={<BookOpen size={24} />}
        title="No Bio Provided"
        description="This user hasn't added a bio yet."
      />
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <BookOpen size={18} />
        <h3>About</h3>
      </div>
      <p className="bio-content">{user.Bio}</p>
    </div>
  );
};
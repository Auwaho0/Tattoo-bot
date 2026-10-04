interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const LoadMoreButton = ({
  onClick,
  isLoading,
  hasMore,
}: LoadMoreButtonProps) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center pt-2 pb-6 w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="relative px-8 h-11
                   bg-[#0a0a0a] border border-[#bba68d]/40 rounded-sm
                   text-[#bba68d] text-xs tracking-widest uppercase font-nunito-san
                   transition-all duration-300
                   hover:border-[#bba68d] hover:shadow-[0_0_20px_rgba(187,166,141,0.2)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 border border-[#bba68d] border-t-transparent rounded-full animate-spin" />
            Загрузка…
          </span>
        ) : (
          'Загрузить ещё'
        )}
      </button>
    </div>
  );
};
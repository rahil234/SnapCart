interface BannerItemProps {
  imageUrl: string;
  image?: string;
}

const BannerItem = ({ imageUrl, image }: BannerItemProps) => {
  return (
    <div className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 h-40 sm:h-48 lg:h-56">
      {image ? (
        <img
          src={imageUrl + image}
          alt="Banner"
          className="w-full h-full object-cover rounded-xl"
        />
      ) : (
        <div className="w-full h-full rounded-xl bg-gray-200 flex items-center justify-center">
          <span>No Banner</span>
        </div>
      )}
    </div>
  );
};

export default BannerItem;

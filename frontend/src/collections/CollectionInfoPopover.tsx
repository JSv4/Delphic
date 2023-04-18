import { useState } from "react";
import { Typography, IconButton, Popover } from "@mui/material";
import { CollectionModelSchema } from "../types";
import InfoIcon from "@mui/icons-material/Info";
import { CollectionCard } from "./CollectionCard";

const bull = <span style={{ paddingLeft: 5 }}>&bull;</span>;

export const CollectionInfoPopover = ({
  canDownload,
  canDelete,
  collection,
}: {
  canDelete: boolean;
  canDownload: boolean;
  collection: CollectionModelSchema;
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Typography variant="h6" noWrap component="div" sx={{ ml: 1 }}>
        {`Collection: ${collection.title}`}
      </Typography>
      <IconButton
        aria-label="collection info"
        onClick={handlePopoverOpen}
        sx={{ ml: 1 }}
      >
        <InfoIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <CollectionCard
          collection={collection}
          canDownload={canDownload}
          canDelete={canDelete}
        />
      </Popover>
    </>
  );
};

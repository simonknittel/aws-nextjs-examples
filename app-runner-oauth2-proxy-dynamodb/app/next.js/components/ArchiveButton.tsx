import { LoadingButton } from "@mui/lab";
import React, { ReactEventHandler } from "react";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import { useUserArchive } from "../modules/user/client";

interface Props {
  params: any;
  callback(): any;
  [key: string]: any; // @TODO: Properly extend LoadingButton's props
}

const ArchiveButton = ({ params, callback, ...other }: Props) => {
  const [isLoading, doArchive] = useUserArchive(params.id);

  const onClick: ReactEventHandler = async (e) => {
    e.preventDefault();
    await doArchive();
    callback();
  };

  return (
    <LoadingButton
      variant="outlined"
      size="small"
      startIcon={<ArchiveOutlinedIcon />}
      onClick={onClick}
      loading={isLoading}
      {...other}
    >
      Archive
    </LoadingButton>
  );
};

export default ArchiveButton;

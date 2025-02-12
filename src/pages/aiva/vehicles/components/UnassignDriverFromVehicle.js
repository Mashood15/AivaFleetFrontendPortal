import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { vehicleService } from "src/services/vehicleService";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Icon from "src/@core/components/icon";
import ModalLoading from "src/components/ModalLoading";
import CustomButton from "src/components/CustomButton";

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: "grey.500",
  position: "absolute",
  boxShadow: theme.shadows[2],
  transform: "translate(10px, -10px)",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: "transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out",
  "&:hover": {
    transform: "translate(7px, -5px)",
  },
}));

function UnassignDriverFromVehicleDialog({ open, statechanger, oneVehicle, setOneVehicle }) {
  const [vehicleDrivers, setVehicleDrivers] = useState([]);
  const [loadingUnassign, setLoadingUnassign] = useState(null); // Track row-specific loading
  const queryClient = useQueryClient();

  // Close dialog function
  const closeModal = () => {
    statechanger(false);
    setOneVehicle(null)
    setLoadingUnassign(false)
  };

  // Fetch assigned drivers
  const { isFetching: loadingDrivers } = vehicleService.getVehicleDrivers(
    "get-vehicle-drivers",
    oneVehicle,
    {
      onSuccess: (response) => {
        if (response.data.isSuccess) {
          setVehicleDrivers(response.data.result);
        } else {
          setVehicleDrivers([]);
        }
      },
      onError: () => setVehicleDrivers([]),
    }
  );

  // Unassign driver mutation
  const { mutate: unassignDriver } = vehicleService.unAssignDriver({
    onSuccess: (response) => {
      if (response.data.isSuccess) {
        toast.success(response.data.message);
        queryClient.invalidateQueries("get-vehicle-drivers");
        setVehicleDrivers((prev) =>
          prev.filter((driver) => driver.driverId !== loadingUnassign)
        );
      } else {
        toast.error(response.data.message);
      }
      setLoadingUnassign(null);
    },
    onError: (error) => {
      toast.error(error.message);
      setLoadingUnassign(null);
    },
  });

  // Handle unassign click
  const handleUnassign = (driverId) => {
    setLoadingUnassign(driverId);
    unassignDriver({ vehicleId: oneVehicle, driverId });
  };

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      aria-labelledby="unassign-driver-dialog-title"
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
    >
      <DialogTitle id="unassign-driver-dialog-title" sx={{ p: 4 }}>
        <Typography variant="h6">Unassign Driver from Vehicle</Typography>
        <CustomCloseButton aria-label="close" onClick={closeModal}>
          <Icon icon="tabler:x" fontSize="1.25rem" />
        </CustomCloseButton>
      </DialogTitle>

      {loadingDrivers ? (
        <ModalLoading />
      ) : (
        <DialogContent dividers sx={{ p: (theme) => `${theme.spacing(4)} !important` }}>
          {vehicleDrivers.length > 0 ? (
            <Grid sx={{
                marginTop: 5
            }} container spacing={2}>
              {vehicleDrivers.map((driver) => (
                <Grid
                  item
                  xs={12}
                  key={driver.driverId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    backgroundColor: "background.paper",
                    marginBottom: 5
                  }}
                >
                  <Box sx={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                    <Typography variant="body1" fontWeight={600}>
                      {driver.driverName.length > 20
                        ? `${driver.driverName.substring(0, 17)}...`
                        : driver.driverName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {driver.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {driver.phoneNumber}
                    </Typography>
                  </Box>

                  <CustomButton
                    onClick={() => handleUnassign(driver.driverId)}
                    disabled={loadingUnassign === driver.driverId}
                    color="error"
                    variant="contained"
                    startIcon={
                      loadingUnassign === driver.driverId ? <CircularProgress size={16} /> : <Icon icon="tabler:trash" />
                    }
                  >
                    {loadingUnassign === driver.driverId ? "Unassigning..." : "Unassign"}
                  </CustomButton>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="textSecondary" textAlign="center">
              No drivers assigned to this vehicle.
            </Typography>
          )}
        </DialogContent>
      )}

      <DialogActions sx={{ p: (theme) => `${theme.spacing(3)} !important` }}>
        <Button onClick={closeModal} color="secondary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UnassignDriverFromVehicleDialog;
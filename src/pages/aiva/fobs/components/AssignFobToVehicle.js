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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fobService } from "src/services/fobService";
import { vehicleService } from "src/services/vehicleService";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import CustomSelect from "src/components/CustomSelect";
import ModalLoading from "src/components/ModalLoading";
import Icon from "src/@core/components/icon";
import FormikProvider from "src/context/formik";
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

function AssignFobToVehicleDialog({ open, statechanger, oneFob, setOneFob }) {
  const [oneFobData, setOneFobData] = useState(null);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const queryClient = useQueryClient();

  // Close dialog function
  const closeModal = () => {
    statechanger(false);
    formik.resetForm();
    setOneFob(null);
  };

  // Fetch FOB details if editing
  const { isFetching: gettingFob } = fobService.getFobs(
    "get-one-fob",
    oneFob,
    "",
    false,
    1,
    1000,
    {
      onSuccess: (response) => {
        if (response.data.isSuccess) {
          setOneFobData(response.data.result.items[0]);
        } else {
          setOneFobData(null);
        }
      },
      onError: () => setOneFobData(null),
      enabled: oneFob !== null,
    }
  );

  // Fetch vehicle options
  const { isFetching: gettingVehicles } = vehicleService.getVehicles(
    "get-vehicles",
    "",
    "",
    false,
    1,
    1000,
    {
      onSuccess: (response) => {
        if (response.data.isSuccess) {
          const temp = response.data.result.items.map((one) => ({
            label: one.registrationNumber,
            value: one.id,
          }));
          setVehicleOptions(temp);
        } else {
          setVehicleOptions([]);
        }
      },
      onError: () => setVehicleOptions([]),
    }
  );

  // Mutation for assigning FOB to vehicle
  const { mutate: assignFobToVehicle, isLoading: savingFob } =
    fobService.assignFobToVehicle({
      onSuccess: (response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.message);
          queryClient.invalidateQueries("get-fobs");
          closeModal();
        } else {
          toast.error(response.data.message);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  // Form validation schema
  const schema = Yup.object().shape({
    vehicleId: Yup.string().required("Vehicle is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      vehicleId: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const payload = {
        fobId: oneFob, // Include the FOB ID when updating
        vehicleId: values.vehicleId,
      };
      assignFobToVehicle(payload);
    },
  });

  // Populate form if editing an existing FOB
  useEffect(() => {
    if (oneFobData) {
      formik.setValues({
        vehicleId: oneFobData?.vehicle?.id || "",
      });
    } else {
      formik.resetForm();
    }
  }, [oneFobData]);

  return (
    <Dialog
  open={open}
  onClose={closeModal}
  aria-labelledby="assign-fob-dialog-title"
  fullWidth
  maxWidth="sm"
  sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
>
      <DialogTitle id="assign-fob-dialog-title" sx={{ p: 4 }}>
        <Typography variant="h6">Assign FOB to Vehicle</Typography>
        <CustomCloseButton aria-label="close" onClick={closeModal}>
          <Icon icon="tabler:x" fontSize="1.25rem" />
        </CustomCloseButton>
      </DialogTitle>

      {gettingFob ? (
        <ModalLoading />
      ) : (
        <DialogContent dividers sx={{ p: (theme) => `${theme.spacing(4)} !important` }}>
            <FormikProvider formik={{...formik, isLoading: savingFob}}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomSelect
                label="Select Vehicle"
                options={vehicleOptions}
                name="vehicleId"
                loading={gettingVehicles}
                requiredField
                disabled={oneFobData?.vehicle?.id}
                helperText={oneFobData?.vehicle?.id ? "Already Assigned" : ""}
              />
            </Grid>
          </Grid>
            </FormikProvider>
          
        </DialogContent>
      )}

      <DialogActions sx={{ p: (theme) => `${theme.spacing(3)} !important` }}>
        <Button onClick={closeModal} color="secondary" variant="outlined">
          Close
        </Button>
        <CustomButton
          onClick={formik.handleSubmit}
          disabled={savingFob}
          loading={savingFob}
          color="primary"
          variant="contained"
        >
          Save
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}

export default AssignFobToVehicleDialog;
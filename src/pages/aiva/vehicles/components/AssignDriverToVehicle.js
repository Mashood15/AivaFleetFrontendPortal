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
import { driverService } from "src/services/driverService";
import { vehicleService } from "src/services/vehicleService";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import CustomSelect from "src/components/CustomSelect";
import CustomInput from "src/components/CustomInput";
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

function AssignDriverToVehicleDialog({ open, statechanger, oneVehicle }) {
  const [driverOptions, setDriverOptions] = useState([]);
  const queryClient = useQueryClient();

  // Close dialog function
  const closeModal = () => {
    statechanger(false);
    formik.resetForm();
  };

  // Fetch driver options
  const { isFetching: gettingDrivers } = driverService.getDrivers(
    "get-drivers",
    "",
    "",
    false,
    1,
    1000,
    "",
    "",
    "",
    {
      onSuccess: (response) => {
        if (response.data.isSuccess) {
          const temp = response.data.result.items.map((one) => ({
            label: `${one.firstName} ${one.lastName}`,
            value: one.id,
          }));
          setDriverOptions(temp);
        } else {
          setDriverOptions([]);
        }
      },
      onError: () => setDriverOptions([]),
    }
  );

  // Mutation for assigning driver to vehicle
  const { mutate: assignDriverToVehicle, isLoading: savingDriver } =
    vehicleService.assignDriverToVehicle({
      onSuccess: (response) => {
        if (response.data.isSuccess) {
          toast.success(response.data.message);
          queryClient.invalidateQueries("get-vehicles");
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
    driverId: Yup.string().required("Driver is required"),
    assignedFrom: Yup.string().required("Assigned From date is required"),
    assignedTo: Yup.string().required("Assigned To date is required"),
    notes: Yup.string(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      driverId: "",
      assignedFrom: "",
      assignedTo: "",
      notes: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const payload = {
        vehicleId: oneVehicle, // Vehicle ID from parent prop
        driverId: values.driverId,
        isPrimaryDriver: true,
        assignmentType: "string",
        assignedFrom: values.assignedFrom,
        assignedTo: values.assignedTo,
        notes: values.notes,
        priority: 1,
      };
      assignDriverToVehicle(payload);
    },
  });

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      aria-labelledby="assign-driver-dialog-title"
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { overflow: "visible" } }}
    >
      <DialogTitle id="assign-driver-dialog-title" sx={{ p: 4 }}>
        <Typography variant="h6">Assign Driver to Vehicle</Typography>
        <CustomCloseButton aria-label="close" onClick={closeModal}>
          <Icon icon="tabler:x" fontSize="1.25rem" />
        </CustomCloseButton>
      </DialogTitle>

      {gettingDrivers ? (
        <ModalLoading />
      ) : (
        <DialogContent dividers sx={{ p: (theme) => `${theme.spacing(4)} !important` }}>
          <FormikProvider formik={{ ...formik, isLoading: savingDriver }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomSelect
                  label="Select Driver"
                  options={driverOptions}
                  name="driverId"
                  loading={gettingDrivers}
                  requiredField
                />
              </Grid>
              <Grid item xs={12}>
                <CustomInput
                  label="Assigned From"
                  name="assignedFrom"
                  type="datetime-local"
                  requiredField
                />
              </Grid>
              <Grid item xs={12}>
                <CustomInput
                  label="Assigned To"
                  name="assignedTo"
                  type="datetime-local"
                  requiredField
                />
              </Grid>
              <Grid item xs={12}>
                <CustomInput label="Notes" name="notes" multiline rows={3} />
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
          disabled={savingDriver}
          loading={savingDriver}
          color="primary"
          variant="contained"
        >
          Save
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}

export default AssignDriverToVehicleDialog;
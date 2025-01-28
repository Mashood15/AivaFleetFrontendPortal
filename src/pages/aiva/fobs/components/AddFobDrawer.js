import React, { Fragment, useEffect, useState } from "react";
import { Box, Grid, Drawer, Typography, IconButton, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styled } from "@mui/material/styles";
import FormikProvider from "src/context/formik";
import CustomInput from "src/components/CustomInput";
import CustomButton from "src/components/CustomButton";
import ModalLoading from "src/components/ModalLoading";
import { fobService } from "src/services/fobService";
import { vehicleService } from "src/services/vehicleService";
import toast from "react-hot-toast";
import Icon from "src/@core/components/icon";
import { useQueryClient } from "@tanstack/react-query";
import CustomSelect from "src/components/CustomSelect";
import { allEnums } from "src/constants/enums";

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(6),
  justifyContent: "space-between",
}));

function AddFobDrawer({ open, statechanger, oneFob, setOneFob }) {
  const [oneFobData, setOneFobData] = useState(null);
  const [vehicleOptions, setVehicleOptions] = useState([])
  const queryClient = useQueryClient();

  const closeModal = () => {
    statechanger(false);
    formik.resetForm();
    setOneFob(null)
  };

  // Fetching single FOB data if editing
  const { isFetching: gettingFob } = fobService.getFobs("get-one-fob", oneFob, "", false, 1, 1000, {
    onSuccess: (response) => {
      if (response.data.isSuccess) {
        setOneFobData(response.data.result.items[0]);
      } else {
        setOneFobData(null);
      }
    },
    onError: () => setOneFobData(null),
    enabled: oneFob !== null,
  });

  // Api call to get vehicles
  const { isFetching: gettingVehicles } = vehicleService.getVehicles("get-vehicles", "", "", false, 1, 1000, {
    onSuccess: (response) => {
      if (response.data.isSuccess) {
        const temp = []
        response.data.result.items.map((one) => {
            const element = {
                label: one.registrationNumber,
                value: one.id
            }
            temp.push(element)
        })
        setVehicleOptions(temp)
      } else {
        setVehicleOptions([]);
      }
    },
    onError: () => setVehicleOptions([]),
  });

  // Mutation for creating or updating a FOB
  const { mutate: createUpdateFob, isLoading: savingFob } = fobService.createUpdateFob({
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
    serialNumber: Yup.string()
      .required("Serial Number is required")
      .min(5, "Serial Number must be at least 5 characters"),
    deviceId: Yup.string().required("Device ID is required"),
    firmwareVersion: Yup.string().required("Firmware Version is required"),
    notes: Yup.string().nullable(),
    status: Yup.string().required("Status is required"),
    vehicleId: Yup.string().nullable(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      serialNumber: "",
      deviceId: "",
      firmwareVersion: "",
      notes: "",
      status: "",
      vehicleId: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        ...(oneFob && { id: oneFob }), // Only include `id` when updating
      };
      createUpdateFob(payload);
    },
  });

  // Populate form if editing an existing FOB
  useEffect(() => {
    if (oneFobData) {
      formik.setValues({
        serialNumber: oneFobData.serialNumber || "",
        deviceId: oneFobData.deviceId || "",
        firmwareVersion: oneFobData.firmwareVersion || "",
        notes: oneFobData.notes || "",
        vehicleId: oneFobData.vehicleId || "",
        status: oneFobData.status || "",
      });
    } else {
      formik.resetForm();
    }
  }, [oneFobData]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeModal}
      PaperProps={{ style: { width: "400px" } }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h5">{oneFob ? "Update FOB" : "Add FOB"}</Typography>
        <IconButton
          size="small"
          onClick={closeModal}
          sx={{
            p: "0.438rem",
            borderRadius: 1,
            color: "text.primary",
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: (theme) => `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      {gettingFob ? (
        <ModalLoading />
      ) : (
        <Fragment>
          <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
            <FormikProvider formik={{ ...formik, isLoading: savingFob }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomInput
                    label="Serial Number"
                    placeholder="Enter Serial Number"
                    name="serialNumber"
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    label="Device ID"
                    placeholder="Enter Device ID"
                    name="deviceId"
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    label="Firmware Version"
                    placeholder="Enter Firmware Version"
                    name="firmwareVersion"
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    label="Status"
                    placeholder="Enter Status"
                    name="status"
                    requiredField
                  />
                </Grid>
                <Grid item xs={12}>
                <CustomSelect
                      label='Vehicle'
                      options={vehicleOptions}
                      name='vehicleId'
                      loading={gettingVehicles}
                    />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    label="Notes"
                    placeholder="Enter Notes (Optional)"
                    name="notes"
                  />
                </Grid>
              </Grid>
            </FormikProvider>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button onClick={closeModal} color="secondary" variant="outlined">
                Cancel
              </Button>
              <CustomButton
                disabled={savingFob}
                loading={savingFob}
                color="primary"
                variant="contained"
                onClick={formik.handleSubmit}
              >
                {oneFob ? "Update FOB" : "Add New FOB"}
              </CustomButton>
            </Box>
          </Box>
        </Fragment>
      )}
    </Drawer>
  );
}

export default AddFobDrawer;

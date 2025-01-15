import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import { IoMdArrowBack } from 'react-icons/io'
import { allEnums } from 'src/constants/enums'
import Avatar from '@mui/material/Avatar'
import CreateLeadFollowup from './CreateLeadFollowup'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentLeadId } from 'src/redux/lead'
import { followUpService } from 'src/services/followUpService'
import NoDataFound from 'src/components/NoDataFound'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

const LeadFollowup = ({ setViewType }) => {
  const [addLeadFollowup, setAddLeadFollowup] = useState(false)
  const currentLeadId = useSelector(state => state.lead.currentLeadId)
  const dispatch = useDispatch()
  const [leadFollowUps, setLeadFollowUps] = useState([])
  const [oneFollowup, setOneFollowup] = useState(null)

  //Api call to get lead follow ups
  const { isFetching: gettingFollowups } = followUpService.getLeadFollowUps(
    'get-lead-followups',
    currentLeadId,
    '',
    '',
    false,
    1,
    1000,
    {
      onSuccess: response => {
        if (response.data.isSuccess) {
          setLeadFollowUps(response.data.result.items)
        } else {
          setLeadFollowUps([])
        }
      },
      onError: () => {
        setLeadFollowUps([])
      }
    }
  )

  // Styled Timeline component
  const Timeline = styled(MuiTimeline)({
    paddingLeft: 0,
    paddingRight: 0,
    '& .MuiTimelineItem-root': {
      width: '100%',
      '&:before': {
        display: 'none'
      }
    }
  })

  return (
    <Box>
      <Card>
        <CardHeader
          title={
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <IconButton
                sx={{ color: 'white' }}
                onClick={() => {
                  dispatch(setCurrentLeadId(null))
                  setViewType?.(allEnums.LeadScreenViewType.listingView)
                }}
              >
                <IoMdArrowBack size={20} />
              </IconButton>
              <Typography variant='h6' component='div' sx={{ marginLeft: '16px', color: 'white' }}>
                Lead Followup
              </Typography>
            </div>
          }
          sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'primary.main' }}
        ></CardHeader>
        <CardContent>
          <Grid container justifyContent='flex-end' mt={3} mb={2}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setAddLeadFollowup(true)}
              sx={{ width: '250px' }}
            >
              Create Followup
            </Button>
          </Grid>
          <Grid mt={5} mb={2}>
            <Card>
              <CardHeader title="Lead Followup's" />
              <CardContent>
                {gettingFollowups ? (
                  <CircularProgress />
                ) : leadFollowUps.length > 0 ? (
                  <Timeline>
                    <TimelineItem>
                      <TimelineSeparator>
                        <TimelineDot color='warning' sx={{ mt: 1.5 }} />
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ pt: 0, mt: 0, mb: theme => `${theme.spacing(2)} !important` }}>
                        <Box
                          sx={{
                            mb: 0.5,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Typography variant='h6' sx={{ mr: 2 }}>
                            Client Meeting
                          </Typography>
                          <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                            Today
                          </Typography>
                        </Box>
                        <Typography variant='body2' sx={{ mb: 2.5 }}>
                          Project meeting with john @10:15am
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src='/images/avatars/3.png' sx={{ mr: 3, width: 38, height: 38 }} />
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary' }}>
                              Lester McCarthy (Client)
                            </Typography>
                            <Typography variant='caption'>CEO of Infibeam</Typography>
                          </Box>
                        </Box>
                      </TimelineContent>
                    </TimelineItem>
                  </Timeline>
                ) : (
                  <NoDataFound message="No Follow Up's Found" />
                )}
              </CardContent>
            </Card>
          </Grid>
        </CardContent>
      </Card>
      {addLeadFollowup && (
        <CreateLeadFollowup
          open={addLeadFollowup}
          statechanger={setAddLeadFollowup}
          oneFollowup={oneFollowup}
          setOneFollowup={setOneFollowup}
        />
      )}
    </Box>
  )
}

export default LeadFollowup

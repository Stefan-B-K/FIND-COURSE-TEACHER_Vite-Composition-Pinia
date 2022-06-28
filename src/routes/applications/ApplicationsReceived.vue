<script setup>
import { reactive } from "vue";
import { useApplications } from "../../stores/applications.js";
import ApplicationItem from "../../components/applications/ApplicationItem.vue";

const applications = useApplications()

const data = reactive({
     isLoading: false,
     error: null
});

const  loadApplications = async () => await tryMethod(applications.fetchApplications);
if (!applications.applicationsLoaded) await loadApplications()

const  deleteApplication = async (appId) => await tryMethod(applications.deleteApplication, appId);
const  tryMethod = async (appFunction, param) => {
     try {
          data.isLoading = true;
          await appFunction(param);
          data.isLoading = false;
     } catch (error) {
          data.error = error.message;
     }
}

const handleError = () => {
     data.isLoading = false;
     data.error = null;
}

</script>


<template>
     <div>
          <BaseDialog
            :show="!!data.error"
            @close="handleError"
            title="Error  fetching applications!!"
          >
               <p>{{ data.error }}</p>
          </BaseDialog>
          <section>
               <BaseCard>
                    <header>
                         <h2>Applications Received </h2>
                         <BaseButton @click="loadApplications" mode="outline">Refresh</BaseButton>
                    </header>
                    <div v-if="data.isLoading">
                         <BaseSpinner />
                    </div>
                    <h3 v-else-if="applications.noApplications">No applications received!</h3>
                    <ul v-else>
                         <ApplicationItem
                           v-for="application in applications.applications"
                           :key="application.id"
                           :application="application"
                           @delete-app="deleteApplication"
                         >
                         </ApplicationItem>
                    </ul>
               </BaseCard>
          </section>
     </div>
</template>


<style scoped>
header {
     text-align: center;
}

ul {
     list-style: none;
     margin: 2rem auto;
     padding: 0;
     max-width: 30rem;
}

h3 {
     text-align: center;
}

</style>
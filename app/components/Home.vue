<template>
  <Page class="ns-dark" actionBarHidden="true">
    <!-- <ActionBar>
      <Label text="Show Tracker" />
    </ActionBar> -->

    <GridLayout>
      <Label class="info">
        <FormattedString>
          <Span class="fas" text.decode="&#xf135; " />
          <Span :text="message" />
        </FormattedString>
      </Label>
    </GridLayout>
  </Page>
</template>

<script>
export default {
  computed: {
    message() {
      return "Show Tracker";
    }
  }
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles
.fas {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}
</style>

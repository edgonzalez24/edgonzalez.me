export default defineAppConfig({
  ui: {
    pageCard: {
      variants: {
        variant: {
          outline: {
            root: 'bg-slate-100 ring-2 ring-gray-400',
          }
        }
      }
    },
    card: {
      slots: {
        body: "flex flex-col gap-2",
      },
    },
    formField: {
      slots: {
        container: "flex flex-col gap-2",
        help: "m-0",
      },
    },
    toaster: {
      slots: {
        viewport: "z-[10001]",
      },
    },
  },
});
